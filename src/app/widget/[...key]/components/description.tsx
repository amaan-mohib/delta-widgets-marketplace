"use client";

import { Divider, Title3 } from "@fluentui/react-components";

interface DescriptionProps {
  description: string;
  title?: string;
}

const Description: React.FC<DescriptionProps> = ({
  description,
  title = "Description",
}) => {
  return (
    <section className="md-body">
      <Divider className="my-5" />
      <Title3>{title}</Title3>
      <div
        className="mt-5"
        dangerouslySetInnerHTML={{ __html: description }}></div>
    </section>
  );
};

export default Description;
