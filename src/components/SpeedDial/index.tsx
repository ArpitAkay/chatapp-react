import { SpeedDial, SpeedDialAction } from '@mui/material'
import { SpeedDialActions } from '../../types/SpeedDialActions';
import { useState } from 'react';

interface SpeedDialProps {
  ariaLabel: string;
  icon: React.ReactNode;
  speedDialActions: SpeedDialActions[]
  direction: 'up' | 'down' | 'left' | 'right';
}

const Index = (props: SpeedDialProps) => {
  const [open, setOpen] = useState<boolean>(false);
  
  return (
    <SpeedDial 
        ariaLabel={props.ariaLabel}
        icon={props.icon}
        direction={props.direction}
        onClick={() => setOpen(!open)}
        open={open}
        sx={{
          position: 'relative',
          left: 10,
          bottom: props.direction === 'up' ? 17 : 0,
          '& .MuiFab-primary': {
            width: 40,
            height: 40,
            color: 'grey',
            bgcolor: '#F0F2F5',
            '&:hover': {backgroundColor: '#F0F2F5'}
          },

        }}
    >
        {
            props.speedDialActions.map((action) => {
                return (
                    <SpeedDialAction
                        sx={{display: open ? 'flex' : 'none'}}
                        icon={action.icon}
                        key={action.name}
                        tooltipTitle={action.name}
                    />
                )
            })
        }
    </SpeedDial>
  )
}

export default Index
