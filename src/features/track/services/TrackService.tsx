"use client";

import { useRef } from "react";
import useCloudinaryStore from "@/app/store/cloudinaryStore";
import { CloudinaryResource } from "@/shared/types/dataType";

interface TrackServiceProps {
  tracks: CloudinaryResource[];
}

function TrackService({ tracks }: TrackServiceProps) {
  useCloudinaryStore.setState({
    cloudinaryData: tracks,
    isLoadingCloudinary: false,
  });

  return null;
}

export default TrackService;
