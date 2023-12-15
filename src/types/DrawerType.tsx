export interface DrawerType {
    variant: 'temporary' | 'persistent';
    anchor: 'left' | 'right' | 'top' | 'bottom'
    open: boolean
    buttonInfo: string
}