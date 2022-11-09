import { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const ButtonBarComponent = (props) => {
  const [selected, setSelected] = useState(null);

  const handleChange = (event, newValue) => {
    props.toUpdate(newValue);
    setSelected(newValue);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={selected}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="home">Home</ToggleButton>
      <ToggleButton value="web">Move</ToggleButton>
      <ToggleButton value="android">Scale</ToggleButton>
      <ToggleButton value="ios">Rotate</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ButtonBarComponent;
