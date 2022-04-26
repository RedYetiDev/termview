# TermView
> The TermView package renders images and videos within the terminal.

## Installing
```bash
npm install termview
```

## Using
* ### Importing Termview
    Just like any package, you need to `require` termview to use it.
    ```js
    const termview = require('termview');
    // Now that termview is imported, you can use "Image, Video, and Gif" functions
    ```
* ### Image
    ![Image](https://user-images.githubusercontent.com/38299977/165391608-737c7c90-1f49-4fee-8334-a91f71187c6c.png)
    The `Image` function can be passed up to four parameters.
    - The path/url to the image to render
    - The optional width to render
    - The optional height to render

    ```js
    var render = await termview.Image('./myimage.png')

    console.log(render)
    ```
* ### Video
    The `Video` function can be passed up to four parameters.
    - The path/url to the video to render
    - The optional FPS to render
    - The optional width to render
    - The optional height to render
    ```js
    await termview.Video('./myvideo.mp4')
    ```

    The `Video` also has two sub functions. `Video.preload` and `Video.render`

    - #### Video.preload
        ![Video](https://user-images.githubusercontent.com/38299977/165392951-5bbf48eb-c50c-4f91-9d5b-750bb2afd3d7.png)

        The `Video.preload` function will load the frame data and return an object like the one below. 
        ```js
        {
            frames: [/* Array of escape codes */],
            width: Number,
            height: Number,
            fps: Number,
        }
        ```

        When calling this function, you can pass up to 3 parameters:
        - The path/url to the video to load
        - The optional width to load
        - The optional height to load

        ```js
        /* Load the video */
        var video = await termview.Video.preload('./myvideo.mp4')

        /* render the video */
        await termview.Video.render(video);
        ```

    - #### Video.render
        The `Video.render` function will render previusly loaded frame data.

        When calling this function, pass an object in the format of:
        ```js
        {
            frames: [/* Array of escape codes */],
            width: Number,
            height: Number,
            fps: Number,
        }
        ```

        Example:
        ```js
        /* Load the video */
        var video = await termview.Video.preload('./myvideo.mp4')
        /*
        {
            frames: [...],
            width: ...,
            height: ...,
            fps: ...,
        }
        */

        /* render the video */
        await termview.Video.render(video);
        ```


* ### GIF
    The `Gif` function can be passed up to four parameters.
    - The path/url to the GIF to render
    - The optional number of iterations to loop (default `10`)
    - The optional width to render
    - The optional height to render

    ```js
    await termview.Gif('./mygif.gif', 100)
    ```