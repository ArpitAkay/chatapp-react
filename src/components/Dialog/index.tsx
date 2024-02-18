import DialogEncryptionInfo from '../DialogEncryptionInfo';
import DialogTakePhoto from '../DialogTakePhoto';

interface DialogProps {
  dialogType: 'DialogEncryptionInfo' | 'DialogTakePhoto';
  isDialogBoxOpen: boolean;
  setIsDialogBoxOpen: (value: boolean) => void
}

const lookup = {
  DialogEncryptionInfo : DialogEncryptionInfo,
  DialogTakePhoto: DialogTakePhoto
};

const Index = (props: DialogProps) => {
  const Component = lookup[props.dialogType];

  return (
    <Component isDialogBoxOpen={props.isDialogBoxOpen} setIsDialogBoxOpen={props.setIsDialogBoxOpen}/>
  );
};

export default Index;
