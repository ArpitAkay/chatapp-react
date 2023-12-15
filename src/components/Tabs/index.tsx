import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import { useState } from 'react'

const Index = () => {
    const [value, setValue] = useState<string>('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    }

  return (
    <>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <TabContext value={value}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={handleChange} aria-label='' orientation='vertical'>
                        <Tab label="Item One" value="1" />
                        <Tab label="Item Two" value="2" />
                        <Tab label="Item Three" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1" tabIndex={0}>Item One</TabPanel>
                <TabPanel value="2">Item Two</TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
            </TabContext>
        </Box>
    </>
  )
}

export default Index
