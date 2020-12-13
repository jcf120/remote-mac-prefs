import { gql, useQuery, useMutation } from "@apollo/client";
import { useCallback } from "react";

const PREFS_QUERY = gql`
  query prefs {
    outputVolume
    inputVolume
    brightness
  }
`;

const SET_OUT_VOLUME = gql`
  mutation setOutputVolume($val: Int!) {
    setOutputVolume(val: $val)
  }
`;

const SET_IN_VOLUME = gql`
  mutation setInputVolume($val: Int!) {
    setInputVolume(val: $val)
  }
`;

const SET_BRIGHTNESS = gql`
  mutation setBrightness($val: Float!) {
    setBrightness(val: $val)
  }
`;

function debounce(f) {
  let task;
  return (...args) => {
    if (task) {
      clearTimeout(task);
    }
    task = setTimeout(() => f(...args), 100);
  };
}

export default function Prefs() {
  const { data: prefs } = useQuery(PREFS_QUERY);
  const [setOutputVolume] = useMutation(SET_OUT_VOLUME);
  const setOutputVolumeDebounced = useCallback(
    debounce((val) => setOutputVolume({ variables: { val } })),
    [setOutputVolume]
  );
  const [setInputVolume] = useMutation(SET_OUT_VOLUME);
  const setInputVolumeDebounced = useCallback(
    debounce((val) => setInputVolume({ variables: { val } })),
    [setInputVolume]
  );
  const [setBrightness] = useMutation(SET_BRIGHTNESS);
  const setBrightnessDebounced = useCallback(
    debounce((val) => setBrightness({ variables: { val } })),
    [setBrightness]
  );
  return (
    <>
      <label>
        Output volume:
        <input
          type="range"
          min="0"
          max="100"
          defaultValue={prefs?.outputVolume}
          onChange={(e) => setOutputVolumeDebounced(Number(e.target.value))}
        />
      </label>
      <label>
        Input volume:
        <input
          type="range"
          min="0"
          max="100"
          defaultValue={prefs?.inputVolume}
          onChange={(e) => setInputVolumeDebounced(Number(e.target.value))}
        />
      </label>
      <label>
        Brightness:
        <input
          type="range"
          min="0"
          step="0.1"
          max="1"
          defaultValue={prefs?.brightness}
          onChange={(e) => setBrightnessDebounced(Number(e.target.value))}
        />
      </label>
    </>
  );
}
