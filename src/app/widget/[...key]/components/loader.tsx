"use client";

import { Spinner } from "@fluentui/react-components";

interface LoaderProps {}

const Loader: React.FC<LoaderProps> = () => {
  return (
    <div className="p-5">
      <Spinner />
    </div>
  );
};

export default Loader;
