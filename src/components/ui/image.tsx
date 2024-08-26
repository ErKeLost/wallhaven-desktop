"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import { cn } from "@/lib/utils"; // 确保您有这个工具函数,用于合并className

const OptimizedImage = forwardRef(
  (
    {
      src,
      alt,
      width,
      height,
      placeholder = "empty",
      onLoad,
      onError,
      className,
      blurDataURL,
      fill,
      ...props
    },
    ref
  ) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
      const img = imgRef.current;
      if (!img) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              img.src = src;
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: "200px" }
      );

      if (img.complete) {
        setLoading(false);
      } else {
        observer.observe(img);
      }

      return () => {
        observer.disconnect();
      };
    }, [src]);

    const handleLoad = (e) => {
      setLoading(false);
      if (onLoad) onLoad(e);
    };

    const handleError = (e) => {
      setLoading(false);
      setError(true);
      if (onError) onError(e);
    };

    const containerStyle = {
      position: "relative",
      ...(fill ? { width: '100%', height: '100%' } : { width, height }),
    };

    const imgStyle = {
      objectFit: "cover",
      opacity: loading ? 0 : 1,
      transition: "opacity 0.3s",
      ...(fill ? { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 } : {}),
    };

    return (
      <div style={containerStyle}>
        {loading && placeholder !== "empty" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#f0f0f0",
            }}
          />
        )}
        <img
          ref={(node) => {
            imgRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          className={cn(
            "transition duration-300",
            loading ? "blur-sm" : "blur-0",
            className
          )}
          alt={alt || "Background of a beautiful view"}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          src={src}
          style={imgStyle}
          {...(blurDataURL && { "data-blur-data-url": blurDataURL })}
          {...props}
        />
        {error && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
            }}
          >
            Error loading image
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
