import DebugMenu from "./debug-menu"
import Importer from "./importer"
import LineRenderer from "./line-renderer"

import Providers from "./providers"

const DevComponentsEditor = () => {
  return (
    <Providers>
      <div className="mt-10">
        <div className="text-right mx-5">
          <DebugMenu />
        </div>
        <div className="mt-5">
          <LineRenderer>
            <div className="w-full h-full">
              <Importer componentName="ui/Select" />
            </div>
          </LineRenderer>
        </div>
      </div>
    </Providers>
  )
}

export default DevComponentsEditor
