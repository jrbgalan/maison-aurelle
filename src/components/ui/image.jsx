import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * High-performance luxury image component for Maison Aurelle.
 * Supports Next.js responsive sizing, object fit, lazy loading, and graceful fallbacks.
 */
const Image = React.forwardRef(
  (
    {
      src,
      alt = "",
      className,
      fittingType = "fill",
      loading = "lazy",
      onError,
      ...props
    },
    ref
  ) => {
    const [hasError, setHasError] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);

    React.useEffect(() => {
      setHasError(false);
      setIsLoaded(false);
    }, [src]);

    const handleError = (e) => {
      setHasError(true);
      onError?.(e);
    };

    if (!src || hasError) {
      return (
        <span
          ref={ref}
          className={cn(
            "flex h-full w-full items-center justify-center bg-oatlinen/60 text-mocha/40 text-xs font-light",
            className
          )}
          role="presentation"
        >
          {alt || "Maison Aurelle"}
        </span>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={cn(
          "w-full h-full transition-opacity duration-700",
          fittingType === "fit" ? "object-contain" : "object-cover",
          !isLoaded && "opacity-90",
          isLoaded && "opacity-100",
          className
        )}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";

export { Image };
