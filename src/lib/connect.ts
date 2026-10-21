export function steamConnectUrl(host: string, port: number): string {
  return `steam://connect/${host}:${port}`;
}

export function copyConnectCommand(host: string, port: number): string {
  return `connect ${host}:${port}`;
}

export function copyServerAddress(host: string, port: number): string {
  return `${host}:${port}`;
}
