import { Slider } from '@mui/material';

const SliderComponent = (props) => {
  const handleSliderChange = (event, value) => {
    props.toUpdate(props.type, value);
  };

  return (
    <Slider
      size="small"
      defaultValue={50}
      aria-label="Small"
      valueLabelDisplay="auto"
      step={0.1}
      onChange={handleSliderChange}
    />
  );
};

export default SliderComponent;
