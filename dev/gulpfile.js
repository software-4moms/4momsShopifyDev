const gulp = require(`gulp`);
const babel = require(`gulp-babel`);
const concat = require(`gulp-concat`);
const browserify = require('browserify');
const source = require('vinyl-source-stream'); 
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const babelify = require('babelify');
/**
 * Asset paths.
 */
const assetsDir = `../assets/`;
/**
 * JS task
 */
gulp.task('js', () => {
    return gulp.src(["./node_modules/jquery/src/*.js", /* importing all of jquery as a dependency at the top of the list */
                    "./node_modules/jquery-zoom/jquery.zoom.min.js",
                    "./node_modules/chosen-js/chosen.jquery.js",
                    "./node_modules/jquery-unveil/jquery.unveil.js",
                    "./node_modules/objectFitPolyfill/src/objectFitPolyfill.js",
                    "./node_modules/lazysizes/lazysizes.js",
                    "./_scripts/core/iePolyFill.js",
                    "./_scripts/core/utils.js",
                    "./_scripts/core/rte.js",
                    "./_scripts/core/a11y.js",
                    "./_scripts/core/animations.js",
                    "./_scripts/core/breakpoints.js",
                    "./_scripts/ui/drawer.js",
                    "./_scripts/ui/overlay.js",
                    "./_scripts/ui/slideup.js",
                    "./_scripts/ui/tabs.js",
                    "./_scripts/ui/videoPlayer.js",
                    "./_scripts/sections/sectionManager.js",
                    "./_scripts/sections/header.js",
                    "./_scripts/sections/footer.js",
                    "./_scripts/sections/mobileMenu.js",
                    "./_scripts/sections/product.js",
                    "./_scripts/sections/cart.js",
                    "./_scripts/sections/ajaxCart.js",
                    "./_scripts/sections/pencilBanner.js",
                    "./_scripts/sections/collection.js",
                    "./_scripts/sections/blog.js",
                    "./_scripts/sections/article.js",
                    "./_scripts/sections/instagramFeed.js",
                    "./_scripts/sections/newsletterModal.js",
                    "./_scripts/sections/newsletterSlideup.js",
                    "./_scripts/sections/slideshow.js",
                    "./_scripts/sections/swatches.js",
                    "./_scripts/sections/video.js",
                    "./_scripts/sections/cmsPage.js",
                    "./_scripts/sections/customersAccount.js",
                    "./_scripts/sections/customersAccountOrders.js",
                    "./_scripts/sections/customersAddresses.js",
                    "./_scripts/sections/customersOrder.js",
                    "./_scripts/sections/icsRecallFlow.js",
                    "./_scripts/sections/testimonials.js",
                    "./_scripts/sections/awardBadges.js",
                    "./_scripts/sections/iconGrid.js",
                    "./_scripts/sections/teamGrid.js",
                    "./_scripts/sections/productFeatures.js",
                    "./_scripts/sections/productMovement.js",
                    "./_scripts/sections/fiftyFifty.js",
                    "./_scripts/sections/collectionMenu.js",
                    "./_scripts/sections/modalVideoPlayer.js",
                    "./_scripts/sections/countryModal.js",
                    "./_scripts/sections/productRegistration.js",
                    "./_scripts/sections/contactForm.js",
                    "./_scripts/sections/jobsListing.js",
                    "./_scripts/sections/canadaPopUp.js",
                    "./_scripts/managers/quickView.js",
                    "./theme_init.js" /* The leftover non-module js from the old theme.js file */
                    ])
        .pipe(babel())
        .pipe(concat('theme.js'))
        .pipe(gulp.dest(assetsDir));
});
gulp.task('js2', () => {
    return browserify({
            entries: [
                './_scripts/theme.js'
            ]
        })
        .transform('babelify', {
            presets: ['@babel/preset-env']
        })
        .bundle()
        .pipe(source('theme.js'))
        .pipe(buffer())
        // .pipe(sourcemaps.init({ loadMaps: false }))
        .pipe(concat('theme.js'))
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(assetsDir));
});
/**
 * Default task
 */
gulp.task(`default`, gulp.series('js2'));