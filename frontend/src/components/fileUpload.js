import * as React from 'react';
import { 
  styled, 
  Button,
  Tooltip
} from '@mui/material';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function InputFileUpload({ onFileContentChange }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      onFileContentChange(event.target.files)
    }
  };

  return (
    <Tooltip title="O arquivo deve ser no formato .xlsx" placement="right-end">

    <Button component="label" variant="contained">
      Upload file
        <VisuallyHiddenInput type="file" id="file" name="file" onChange={handleFileChange}/>
    </Button>
    </Tooltip>

  );
}
