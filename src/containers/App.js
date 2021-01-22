import { Suspense } from "react";

import Album from "./album/Album";

function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Album />
    </Suspense>
  );
}

export default App;
