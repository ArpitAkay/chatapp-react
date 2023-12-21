import { Box, Drawer, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DrawerType } from "../../types/DrawerType";
import Profile from "../Profile";
import ContactInfo from "../ContactInfo"
import Navbar from "../Navbar";

interface DrawerProps {
  drawerType: DrawerType | null;
  setDrawerType: (drawerType: DrawerType | null) => void;
}

const lookup = {
  'Communities': Profile,
  'Status': Profile,
  'Channels': Profile,
  'New chat': Profile,
  'Profile': Profile,
  'New group': Profile,
  'New community': Profile,
  'Starred messages': Profile,
  'Settings': Profile,
  'Contact info': ContactInfo,
  'Disappearing messages': ContactInfo
};

const Index = (props: DrawerProps) => {
  const Component = props.drawerType  && props.drawerType.buttonInfo ? lookup[props.drawerType?.buttonInfo] : lookup['Communities'];

  console.log(Component);


  return (
    <Drawer
      variant={props.drawerType?.variant}
      anchor={props.drawerType?.anchor}
      open={props.drawerType?.open}
      sx={
        props.drawerType?.anchor === "right"
          ? {
              width: "30vw",
              backgroundColor: '#F0F2F5',
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: "30vw",
                boxSizing: "border-box",
                backgroundColor: 'F0F2F5'
              },
            }
          : 
          {
            "& .MuiDrawer-paper": {
              width: "30vw",
              backgroundColor: '#F0F2F5'
            }
          }
      }
    >
      { props.drawerType?.buttonInfo === 'Contact info' &&  <Navbar name={props.drawerType?.buttonInfo} showName={true} setDrawerType={props.setDrawerType}/> }
      { props.drawerType?.buttonInfo !== 'Contact info' &&  <Box
        sx={{
          height: "14%",
          backgroundColor: "#008069",
          display: "flex",
          justifyContent: "start",
          alignItems: "end",
        }}
      >
        <Stack spacing={3} direction={"row"} color={"white"} m={2}>
          <ArrowBackIcon
            onClick={() => props.setDrawerType(null)}
            sx={{ paddingTop: "4px" }}
          />
          <Typography variant="h6" gutterBottom>
            {props.drawerType?.buttonInfo}
          </Typography>
        </Stack>
      </Box>}
      <Component />
    </Drawer>
  );
};

export default Index;
