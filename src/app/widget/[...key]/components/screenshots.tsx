"use client";

import { Assets } from "@/lib/db";
import {
  Carousel,
  CarouselAnnouncerFunction,
  CarouselCard,
  CarouselNav,
  CarouselNavButton,
  CarouselNavContainer,
  CarouselNavImageButton,
  CarouselSlider,
  CarouselViewport,
  Image,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

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
  },
  image: {
    width: "100%",
    maxHeight: "400px",
    objectFit: "scale-down",
  },
});

const ImageCard: React.FC<{ url: string }> = (props) => {
  const classes = useClasses();
  const { url } = props;

  return <Image className={classes.image} src={url} role="presentation" />;
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
  const classes = useClasses();

  return (
    <Carousel groupSize={1} align="center" announcement={getAnnouncement}>
      <CarouselViewport className={classes.viewport}>
        <CarouselSlider>
          {screenshots.map((image, index) => (
            <CarouselCard
              key={process.env.NEXT_PUBLIC_CF_R2_SRC_PREFIX + image.src}
              className={classes.card}
              aria-label={`${index + 1} of ${screenshots.length}`}>
              <ImageCard
                url={process.env.NEXT_PUBLIC_CF_R2_SRC_PREFIX + image.src}
              />
            </CarouselCard>
          ))}
        </CarouselSlider>
      </CarouselViewport>

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
    </Carousel>
  );
};

export default Screenshots;
