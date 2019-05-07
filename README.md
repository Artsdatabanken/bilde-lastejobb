## Size issues

If seeing errors:
```
mogrify-im6.q16: width or height exceeds limit `../image/source/banner/AO-02-37.jpg' @ error/cache.c/OpenPixelCache/3839.
```

Increase width/height maximum limits from 16KP in policy.xml: https://github.com/ImageMagick/ImageMagick/issues/396

