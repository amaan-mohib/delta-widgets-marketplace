"use client";

import { Assets } from "@/lib/db";
import {
  Carousel,
  CarouselAnnouncerFunction,
  CarouselCard,
  CarouselNav,
  CarouselNavButton,
  CarouselNavContainer,
  CarouselSlider,
  CarouselViewport,
  Image,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";

const useClasses = makeStyles({
  viewport: {
    background: tokens.colorNeutralBackgroundAlpha,
    padding: "10px",
    borderRadius: "4px",
  },
  card: {
    boxSizing: "border-box",
    width: "100%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const ImageCard: React.FC<{ url: string; hidden?: boolean }> = (props) => {
  const { url } = props;

  return (
    <Image
      src={url}
      role="presentation"
      style={
        props.hidden
          ? { display: "none" }
          : {
              width: "100%",
              maxHeight: "clamp(200px, 50vh, 400px)",
              objectFit: "scale-down",
            }
      }
    />
  );
};

const getAnnouncement: CarouselAnnouncerFunction = (
  index: number,
  totalSlides: number,
) => {
  return `Carousel slide ${index + 1} of ${totalSlides}`;
};

interface ScreenshotsProps {
  screenshots: Assets[];
}

const Screenshots: React.FC<ScreenshotsProps> = ({ screenshots }) => {
  const [init, setInit] = useState(true);
  const classes = useClasses();

  useEffect(() => {
    setInit(false);
  }, []);

  if (init) {
    return (
      <div
        className="flex items-center gap-2 overflow-x-auto justify-center"
        style={{
          background: tokens.colorNeutralBackgroundAlpha,
          padding: "10px",
          borderRadius: "4px",
        }}>
        {screenshots.map((image, index) => (
          <ImageCard key={image.src} url={image.src} hidden={index !== 0} />
        ))}
      </div>
    );
  }

  return (
    <Carousel groupSize={1} align="center" announcement={getAnnouncement}>
      <CarouselViewport className={classes.viewport}>
        <CarouselSlider>
          {screenshots.map((image, index) => (
            <CarouselCard
              key={image.src}
              className={classes.card}
              aria-label={`${index + 1} of ${screenshots.length}`}>
              <ImageCard url={image.src} />
            </CarouselCard>
          ))}
        </CarouselSlider>
      </CarouselViewport>

      {screenshots.length > 1 && (
        <CarouselNavContainer
          layout="inline"
          autoplayTooltip={{ content: "Autoplay", relationship: "label" }}
          nextTooltip={{ content: "Go to next", relationship: "label" }}
          prevTooltip={{ content: "Go to prev", relationship: "label" }}>
          <CarouselNav>
            {(index) => (
              <CarouselNavButton aria-label={`Carousel Nav Button ${index}`} />
            )}
          </CarouselNav>
        </CarouselNavContainer>
      )}
    </Carousel>
  );
};

export default Screenshots;
