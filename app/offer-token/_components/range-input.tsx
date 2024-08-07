"use client";

import React, { useMemo } from "react";
import styled from "styled-components";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Wrapper = styled.div`
  margin-top: 10px;
  padding: 0 5px;
  .rc-slider-mark {
    font-size: 10px;
  }
  .rc-slider-mark-text-active:last-chid {
    color: green;
  }
`;

function RangeInput({
  value,
  maxLeverage,
  onChange,
  mixedColor,
}: {
  value: number;
  maxLeverage: number;
  onChange: any;
  mixedColor: string;
}) {
  const marks = useMemo(() => {
    if (maxLeverage === 100) {
      return {
        "0": "0",
        25: "25",
        50: "50",
        75: "75",
        100: "100",
      };
    }

    const range = (
      start: number,
      stop: number,
      step = maxLeverage < 10 ? 1 : Math.floor(maxLeverage / 10),
    ) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step,
      ).reduce((a, v) => ({ ...a, [v]: v, [maxLeverage]: maxLeverage }), {});

    return range(1, maxLeverage);
  }, [maxLeverage]);
  return (
    <Wrapper>
      <Slider
        styles={{
          track: {
            background: `#4CE6A1`,
            height: 4,
          },
          handle: {
            borderColor: "#4CE6A1",
            borderWidth: "1px",
            opacity: 1,
            height: 12,
            width: 12,
            marginTop: -4,
            borderRadius: 2,
            boxShadow: "none",
            backgroundColor: mixedColor,
          },
          rail: {
            width: "calc(100% + 8px)",
            marginLeft: "-4px",
            background: "gray",
          },
          tracks: {
            borderRadius: "4px",
            height: "8px",
            width: "1px",
            borderColor: "#4CE6A1",
          },
        }}
        min={0}
        max={maxLeverage}
        step={1}
        marks={marks}
        value={value}
        activeDotStyle={{ borderColor: "#4CE6A1" }}
        onChange={onChange}
      />
    </Wrapper>
  );
}

export default RangeInput;
