export interface UserInfo {
    id: number,
    name: string
    active?: boolean,
    profileStatus?: string,
    profileImageUrl?: string
}

export interface UserInfoResponse extends UserInfo {
    latestMessage: string,
    latestMessageTime: string
}