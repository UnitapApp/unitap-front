"use client"

import Select from "@/components/ui/Select"
import { useComponentsContext } from "./providers"
import Input from "@/components/ui/input"
import { Button } from "@/components/ui/Button/button"
import Icon from "@/components/ui/Icon"

const DebugMenu = () => {
  const { debugMenuToolbar, setDebugMenuToolbar } = useComponentsContext()

  return (
    <div className="p-4 text-left inline-block rounded-xl bg-gray40 border-gray70 border">
      <p>Debug Menu</p>
      <div
        onClick={() =>
          setDebugMenuToolbar({
            ...debugMenuToolbar,
            liningEnabled: !debugMenuToolbar.liningEnabled,
          })
        }
        className="mt-5 flex items-center gap-5"
      >
        <Icon
          iconSrc={
            debugMenuToolbar.liningEnabled
              ? "/assets/images/provider-dashboard/check-true.svg"
              : "/assets/images/provider-dashboard/checkbox.svg"
          }
        />{" "}
        Enable Lining Render
      </div>
      <div className="mt-5">
        <Select
          options={[
            {
              label: "Pixel",
              value: "px",
            },
            {
              label: "Rem",
              value: "rem",
            },
            {
              label: "cm",
              value: "cm",
            },
            {
              label: "em",
              value: "em",
            },
          ]}
          label="Lining Unit"
          onChange={(value) =>
            setDebugMenuToolbar({
              ...debugMenuToolbar,
              liningMethod: value as any,
            })
          }
          value={debugMenuToolbar.liningMethod}
        />
      </div>

      <Input
        $label="Lining Margin"
        value={debugMenuToolbar.liningMargin}
        onChange={(e) =>
          setDebugMenuToolbar({
            ...debugMenuToolbar,
            liningMargin: Number(e.target.value),
          })
        }
        type="number"
      />
      <p className="mt-4">Rendering Size:</p>
      <div className="flex border mt-3 rounded-xl border-gray100 items-center">
        <Button>Mobile</Button>
        <Button>Tablet</Button>
        <Button>Desktop</Button>
      </div>
      {/* <input type="text" /> */}
    </div>
  )
}

export default DebugMenu
