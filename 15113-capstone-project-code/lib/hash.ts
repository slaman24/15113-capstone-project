import * as ExpoCrypto from 'expo-crypto';

export async function hashPassword(password: string): Promise<string> {
  return ExpoCrypto.digestStringAsync(
    ExpoCrypto.CryptoDigestAlgorithm.SHA256,
    password,
  );
}
