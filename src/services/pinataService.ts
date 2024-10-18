const jwt = process.env.REACT_APP_PINATA_JWT;

// Group availability check
export const checkGroupExists = async (location: string) => {
  const response = await fetch("https://api.pinata.cloud/groups", {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const data = await response.json();
  if (data && data.rows) {
    return data.rows.find((group: any) => group.name === location);
  }
  return null;
};

// Create new group
export const createGroup = async (location: string) => {
  const response = await fetch("https://api.pinata.cloud/groups", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: location,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create a group');
  }

  const data = await response.json();
  if (!data.id) {
    throw new Error(' A group is created, but there is no ID');
  }

  return data;
};

//  Checking if a user is in a group
export const checkUserExistsInGroup = async (username: string, groupId: string) => {
  const response = await fetch(`https://api.pinata.cloud/data/pinList?groupId=${groupId}&status=pinned`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const contentType = response.headers.get('content-type');
  const responseBody = await response.text();

  // console.log('Content Type:', contentType);
  // console.log('Response Body:', responseBody);

  if (contentType && contentType.includes('application/json')) {
    const data = JSON.parse(responseBody);
    // console.log('Parsed data:', data);
    if (data && data.rows && Array.isArray(data.rows)) {
      for (const file of data.rows) {
        if (file.mime_type === 'application/json') {
          const fileResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${file.ipfs_pin_hash}`);
          const fileData = await fileResponse.json();
          if (fileData.author === username) {
            // console.log(`User ${username} found in group ${groupId}`);
            return true;
          }
        }
      }
    }
  }
  // console.log(`User ${username} not found in group ${groupId}`);
  return false;
};

// Uploading review to IPFS
export const uploadReviewToIPFS = async (formData: FormData) => {
  const response = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error loading a review in IPFS');
  }

  const data = await response.json();
  return data.IpfsHash;
};

// Adding CIDs to a group
export const addCIDsToGroup = async (cids: string[], groupId: string) => {
  const response = await fetch(`https://api.pinata.cloud/groups/${groupId}/cids`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cids }),
  });

  if (!response.ok && !(response.status === 200 && response.statusText === "OK")) {
    throw new Error('Error adding CIDs to a group');
  }
};

export const fetchAllGroups = async () => {
  const response = await fetch("https://api.pinata.cloud/groups", {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const data = await response.json();
  // console.log('Response Data from Pinata:', data); // Let's see exactly what's coming in

  if (Array.isArray(data)) { // Check that data is an array
    // console.log('Fetched groups:', data); // Array Logging
    return data;
  } else {
    // console.log('No groups found or unexpected format');
    return [];
  }
};

