const jwt = process.env.REACT_APP_PINATA_JWT;

// Проверка наличия группы
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

// Создание новой группы
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
    throw new Error('Не удалось создать группу');
  }

  const data = await response.json();
  if (!data.id) {
    throw new Error('Группа создана, но ID отсутствует');
  }

  return data;
};

// Проверка наличия пользователя в группе
export const checkUserExistsInGroup = async (username: string, groupId: string) => {
  const response = await fetch(`https://api.pinata.cloud/data/pinList?groupId=${groupId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const contentType = response.headers.get('content-type');
  const responseBody = await response.text();

  if (contentType && contentType.includes('application/json')) {
    const data = JSON.parse(responseBody);
    if (data && data.rows && Array.isArray(data.rows)) {
      for (const file of data.rows) {
        if (file.mime_type === 'application/json') {
          const fileResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${file.ipfs_pin_hash}`);
          const fileData = await fileResponse.json();
          if (fileData.author === username) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

// Загрузка отзыва в IPFS
export const uploadReviewToIPFS = async (formData: FormData) => {
  const response = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Ошибка загрузки отзыва в IPFS');
  }

  const data = await response.json();
  return data.IpfsHash;
};

// Добавление CIDs в группу
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
    throw new Error('Ошибка добавления CIDs в группу');
  }
};