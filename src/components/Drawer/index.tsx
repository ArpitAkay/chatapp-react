import { Box, Drawer, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DrawerType } from "../../types/DrawerType";
import Profile from "../Profile";

interface DrawerProps {
  drawerType: DrawerType | null;
  setDrawerType: (drawerType: DrawerType | null) => void;
}

const lookup = {
  Profile: Profile
};

const Index = (props: DrawerProps) => {
  // const Component = lookup[props.drawerType?.buttonInfo];

  return (
    <Drawer
      variant={props.drawerType?.variant}
      anchor={props.drawerType?.anchor}
      open={props.drawerType?.open}
      onClose={() => props.setDrawerType(null)}
      sx={
        props.drawerType?.anchor === "right"
          ? {
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
      <Box
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
      </Box>
      <Profile />
    </Drawer>
  );
};

export default Index;
