import CryptoJS from 'crypto-js'

export const decrypt = (base64EncryptedData, decryptionKey, initializationVector) => {
  const key = CryptoJS.SHA256(decryptionKey).toString()
  const encryptedData = CryptoJS.enc.Base64.parse(base64EncryptedData)
  const options = { iv: CryptoJS.enc.Utf8.parse(initializationVector), keySize: 32, mode: CryptoJS.mode.CBC }
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, CryptoJS.enc.Hex.parse(key), options)

  try {
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (exception) {
    return ''
  }
}
