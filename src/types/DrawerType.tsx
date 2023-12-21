export interface DrawerType {
    variant: 'temporary' | 'persistent';
    anchor: 'left' | 'right' | 'top' | 'bottom'
    open: boolean
    buttonInfo: 'Communities' | 'Status' | 'Channels' | 'New chat' | 'Profile' | 'New group' | 'New community' | 'Starred messages' | 'Settings' | 'Contact info' | 'Disappearing messages' 
}