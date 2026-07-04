"use client"

import { PhotoProvider, PhotoView } from "react-photo-view"
import "react-photo-view/dist/react-photo-view.css"

type Props = {
  src: string
  children: React.ReactElement
}

export function ImagePreviewWrapper({ src, children }: Props) {
  return (
    <PhotoProvider maskOpacity={0.7} bannerVisible={false} photoClosable>
      <PhotoView src={src}>
        {children}
      </PhotoView>
    </PhotoProvider>
  )
}
