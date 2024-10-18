import Compressor from 'compressorjs';

const jwt = process.env.REACT_APP_PINATA_JWT;

export const uploadCompressedPhoto = async (photo: File, jwt: string): Promise<{ cid: string; name: string }> => {
  return new Promise((resolve, reject) => {
    new Compressor(photo, {
      quality: 0.6,
      convertTypes: ['image/png', 'image/webp'],
      convertSize: 500000,
      success(result) {
        let formData = new FormData();
        formData.append('file', result, photo.name);

        fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => resolve({ cid: data.IpfsHash, name: photo.name }))
          .catch((error) => reject(error));
      },
      error(err) {
        reject(err);
      },
    });
  });
};
