import { NextRequest, NextResponse } from "next/server";
import { Image, Gallery, SearchParams } from "@/lib/types";

// Mock data
const MOCK_IMAGES: Image[] = [
  {
    id: "1",
    title: "Mountain Landscape",
    description: "Beautiful mountain scenery",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200",
    category: "nature",
    tags: ["mountain", "landscape", "nature"],
    createdAt: new Date().toISOString(),
    likes: 42,
  },
  {
    id: "2",
    title: "Ocean Waves",
    description: "Calm ocean waves at sunset",
    imageUrl:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200",
    category: "nature",
    tags: ["ocean", "waves", "beach"],
    createdAt: new Date().toISOString(),
    likes: 38,
  },
  {
    id: "3",
    title: "City Lights",
    description: "Urban photography at night",
    imageUrl:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200",
    category: "urban",
    tags: ["city", "night", "lights"],
    createdAt: new Date().toISOString(),
    likes: 55,
  },
  {
    id: "4",
    title: "Forest Path",
    description: "Peaceful forest trail",
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200",
    category: "nature",
    tags: ["forest", "path", "nature"],
    createdAt: new Date().toISOString(),
    likes: 29,
  },
  {
    id: "5",
    title: "Desert Sunset",
    description: "Golden hour in the desert",
    imageUrl:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=200",
    category: "nature",
    tags: ["desert", "sunset", "landscape"],
    createdAt: new Date().toISOString(),
    likes: 61,
  },
];
