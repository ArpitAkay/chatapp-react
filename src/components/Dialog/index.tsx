import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { Button } from "@mui/material-next";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import React from "react";

interface DialogProps {
  encryptionInfoDialogBox: boolean;
  setEncryptionInfoDialogBox: React.Dispatch<React.SetStateAction<boolean>>;
}

const Index = (props: DialogProps) => {
  return (
    <Dialog open={props.encryptionInfoDialogBox} maxWidth={"sm"}>
      <DialogContent>
        <DialogTitle id='dialog-title' textAlign={'center'} marginBottom={4}>Your chats and calls are private</DialogTitle>
        <DialogContentText>
            <Box display={'flex'} justifyContent={'center'} marginBottom={4}>
              <Typography
                variant="body2"
                color={"#8696A0"}
                fontSize={"15px"}
                maxWidth={"75%"}
              >
                End-to-end encryption keeps your personal messages and calls
                between you and the people you choose. Not even WhatsApp can read
                or listen to them. This includes your:
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Stack spacing={1} minWidth={"80%"}>
                <Stack spacing={2} direction={"row"}>
                  <ChatBubbleOutlineIcon color="inherit" />
                  <Typography variant="body2" color={"#8696A0"}>
                    Text and voice messages
                  </Typography>
                </Stack>
                <Stack spacing={2} direction={"row"}>
                  <LocalPhoneIcon />
                  <Typography variant="body2" color={"#8696A0"}>
                    Audio and video calls
                  </Typography>
                </Stack>
                <Stack spacing={2} direction={"row"}>
                  <AttachFileIcon />
                  <Typography variant="body2" color={"#8696A0"}>
                    Photos, videos and documents
                  </Typography>
                </Stack>
                <Stack spacing={2} direction={"row"}>
                  <LocationOnIcon />
                  <Typography variant="body2" color={"#8696A0"}>
                    Location sharing
                  </Typography>
                </Stack>
                <Stack spacing={2} direction={"row"}>
                  <AutorenewIcon />
                  <Typography variant="body2" color={"#8696A0"}>
                    Status updates
                  </Typography>
                </Stack>
              </Stack>
            </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Stack spacing={1} direction={"row"} marginRight={6} marginY={4}>
          <Button
            variant="outlined"
            size="small"
            sx={{ color: "#008069", border: "2px solid rgb(233, 237, 239)" }}
            onClick={() => props.setEncryptionInfoDialogBox(false)}
          >
            OK
          </Button>
          <Button
            variant="filled"
            size="small"
            sx={{ bgcolor: "#008069", "&:hover": {
              backgroundColor: '#008069'
            } }}
            href="https://www.whatsapp.com/security/?lg=en"
            target="_blank"
          >
            Learn More
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default Index;
