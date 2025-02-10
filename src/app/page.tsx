"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import messages from "@/messages.json";

import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Home = () => {
  return (
    <>
      <main className="flex-grow flex flex-col justify-center items-center px-4 md:px-24 py-12">
        <section className="text-center mb-4 md:mb-12">
          <h1
            className="text-xl md:text-5xl font-bold lg:text-3xl
          xl:text-4xl"
          >
            Dive into the world of Anonymous Conversations with Stealth Note 🕵️‍♂️
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore Stealth Note - Where your identity always remains a secret.
          </p>
        </section>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-screen-sm lg:max-w-screen-2xl"
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-4">
                      <span className="text-xl font-semibold">
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-center p-2 md:p-2">
        © 2025 Stealth Note. All rights reserved.
      </footer>
    </>
  );
};

export default Home;
