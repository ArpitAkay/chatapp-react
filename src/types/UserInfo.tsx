export interface UserInfo {
    id: number,
    name: string
    active?: boolean,
    profileStatus?: string,
}

export interface UserInfoResponse extends UserInfo {
    latestMessage: string,
    latestMessageTime: string
}