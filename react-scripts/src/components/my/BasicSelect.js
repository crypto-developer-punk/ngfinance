import React, { useState } from 'react';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import {InputLabel, FormControl, Box, Select, MenuItem, OutlinedInput} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formcontrol: {
    // borderWidth: 1,
    // borderColor: 'red'
  }
}))

const BasicSelect = props => {
  const [selectIndex, setSelectIndex] = React.useState(props.defaultIndex);
  const classes = useStyles();

  const handleChange = (event) => {
    const v = event.target.value;
    if (props.data) {
      const idx = props.data.findIndex((e) => e.value === v);
      setSelectIndex(idx);
      props.onChanged && props.onChanged({target: props.data[idx]});
    }
  };

  const getCurrentValue = () => {
    if (!props.data)
      return "";
    return props.data[selectIndex].value;
  };

  const getCurrentLabel = () => {
    if (!props.data)
      return "";
    return props.data[selectIndex].label;
  };

  return (
    <Box style={props.boxStyle}>
      <FormControl fullWidth size="small" margin={'none'} >
        {/* <InputLabel id="demo-simple-select-helper-label">{props.title}</InputLabel> */}
        <Select
          value={getCurrentValue()}
          label={getCurrentLabel()}
          onChange={handleChange}
        >
          {props.data.map((e, idx) => {return (<MenuItem key={idx} value={e.value}>{e.label}</MenuItem>)})}
        </Select>
      </FormControl>
    </Box>
  );
}

export default BasicSelect;