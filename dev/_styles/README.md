# Styles

Our SCSS architecture is inspired by Bootstrap 4 with some minor changes. This allows us to easily add components styling in an organized way, while leveraging the codebase consistency of Bootstrap.

## Structure

The main entry point for all styling on the site is `_styles/theme.scss`. Additionally, there is a `checkout.scss` file that runs in place of this file on the Shopify checkout pages, however you must reach out to our Shopify success manager to enable this level of custom checkout (a.k.a. to allow `checkout.liquid` and `checkout.scss` to take effect).

SCSS files are organized as follows:
```
├── checkout/               # Components that only exist on checkout pages
├── components/             # Reusable components
├── bootstrap-modified/     # Bootstrap files + add'tl core functionality - these files should NOT to be changed per project
├── core                    # Project-specific utilities, typography, mixins, and fundamental UI building blocks
├── modules/                # Single purpose elements on the site (non-reuasble)
├── templates/              # Styles specific to a single template or area of the site
├── vendor/                 # Third party styles
├── checkout.scss
└── theme.scss
```

## Typography

Native typography elements (`<h1>...<h6>, <p>, <li>`) are meant to define the document outline, and should be separated from visual requirements. An `<h3>` in one module may look nothing like the `<h3>` in another, and header levels can always change based on SEO.

While we *do* create default styling for native elements (for the sake of rich text blocks, and for default styling in places where we have limited control), this repo uses primarily *Content-Based Type Classes* to style all text.

To style type elements, open `_core/type.scss` and create a responsive, content-based class with a name that describes *the most common usage* for that type style. Include the placeholder selector (`%`) to allow for clean extensions:

*EXAMPLE*

```scss
// _core/type.scss

%txt-footer-link,
.txt-footer-link {
  @extend %font-gotham-regular;
  font-size: ...;
  letter-spacing: ...;
  line-height: ...;

  @include media-breakpoint-up("sm") {
    font-size: ...;
    letter-spacing: ...;
    line-height: ...;
  }
}
```

### Implement type classes with @extend

Once a type class has been created, `@extend` or include in HTML as necessary.

*EXAMPLE*

```scss
// _components/footer.scss

.footer-link {
  @extend %txt-footer-link;
  color: $black;
}
```

You can also use classes directly in markup, i.e. `<a href="" class="txt-footer-link">About Us</a>`.

### Typography units

In short, use:

```scss
font-size: <rem>;
letter-spacing: <em>;
line-height: <unitless>;
```

Several functions have been created to make translating these values from comp to code easier. Most comping applications have values available in *px*, so:

```
font-size: fontsize(<font size in pixels>);
letter-spacing: letterspacing(<letter spacing in pixels>);
line-height: lineheight(<line height in pixels>, <font size in pixels>);
```

The first `lineheight()` parameter also accepts a value of "normal", which returns `1.2`, the standard numerical value for line height in design. In this case, the second parameter is ignored.

### Colors

Color names should be generated using ([Name that color](http://chir.ag/projects/name-that-color/#6195ED) and added to `core/variables.scss`. Do not use relative palette names like "gray-lighter," "gray-dark," "gray-darker," "gray-darkest." This is both unhelpful and extremely limited. *There will always be a darker gray*.

Add color swatches to the style guide for easy reference.

```scss
// DON'T name like this:

$gray-lighter: #f8f9fa;
$gray:         #cccccc;
$gray-dark:    #666666;
$gray-darker:  #494949;
$gray-darkest: #212529;
```

```scss
// DO name like this:

$athens:       #f8f9fa;
$silver:       #cccccc;
$dove:         #666666;
$tundora:      #494949;
$shark:        #212529;
```

## Icons & SVGs

There are two ways to include SVGs within this project:

1. Drop .svg files into the `icons/` folder. This will automatically generate alternate versions of these SVGs with a fixed `.icon` class and other configuration. Be aware that this may have unintended side-effects due to the automation, e.g. all custom classes will be stripped from the original SVG element, and some auto-styling and sizing will be applied.
2. Create custom SVGs and include them as snippets. This is preferred if you'd like more control over the SVG styling and structure, but is more advanced.

## Using our modifed Bootstrap

If you compare `theme.scss` with the default Bootstrap stylesheet ([see here](https://github.com/twbs/bootstrap/blob/master/scss/bootstrap.scss)) you'll notice a lot of similarities. The project is structured to use bootstrap as the __base__ of the styling and add all additional functionality in more appropriate subdirectories. With that in mind, all bootstrap files can be found in `_styles/bootstrap-modifed`.


### Config variables and customization

*Never change any of the files within `_styles/bootstrap-modifed`.*

Changing these files directly negates our ability to upgrade Bootstrap in the future, and mingles project-specific code with reusable scaffolding. Bootstrap variables are meant to be overridden (not changed).

If you need to customize variables that originate from within `bootstrap-modified`, just override them elsewhere and make a comment as such. For example: most project specific SCSS variables live within `core/variables.scss`, so:

#### Default Bootstrap variable

```scss
// _styles/bootstrap-modifed/variables.scss

// *DON'T CHANGE THIS FILE*

$input-font-weight:                     $font-weight-base !default;
```

#### Project override

```scss
//_styles/core/variables.scss

$input-font-weight:                     400; // BS4 override
```

### A note on variables in general

With respect to variables in general: try to avoid too many variable dependencies (e.g. one variable referencing another variable, referencing another, etc.). Many Bootstrap components rely on this method, which — while sometimes useful for automation — can take time to decipher, and can make too many design assumptions regarding which elements should share configuration.

Rule of thumb: if you use a value more than 3 times, it may be worth adding it to `_core/variables.scss`. If you go more than 2 levels deep with variable dependencies, just make sure it's necessary.

## Configuring the top navigation

Header treatment is configured on a page level using data attributes and `header.scss`, and is controlled by `header.js`. There are two possible configurations for each page layout:

1. Light text on a transparent background (DEFAULT - top spacing must be built into first page module).
2. Dark text on a white background (usually for CMS or account pages - extra spacing automatically added to the page wrapper).

To configure the header appearance for a page, just add the `data-top-nav-bg` attribute to the primary page wrapper (usually a `<div>` with `data-section-id="{{ section.id }}"` if it's not the homepage), then set the attribute to either `top-nav-bg-white` or `top-nav-bg-transparent`:

```liquid
<div data-section-id="{{ section.id }}" data-top-nav-bg="top-nav-bg-white">
...
```

If you'd like to surface controls in the page editor, just add them into the section settings:

```liquid
{% if section.settings.top_nav_bg_setting != blank and section.settings.top_nav_bg_setting == "white_nav"%}
  {% assign top_nav_bg_attr = "top-nav-bg-white" %}
{% else %}
  {% assign top_nav_bg_attr = "top-nav-bg-transparent" %}
{% endif %}

<div data-section-id="{{ section.id }}" data-top-nav-bg={{ top_nav_bg_attr }}>

...

{
  "name": "Page Name",
  "settings": [
    {
      "type": "header",
      "content": "Top Navigation",
      "info": "Determine whether top nav is transparent to show background of first page module, OR if top nav is above solid white."
    },
    {
      "type": "radio",
      "id": "top_nav_bg_setting",
      "label": "Top Nav Background",
      "options": [
        { "value": "transparent_nav", "label": "Transparent Nav Background" },
        { "value": "white_nav", "label": "White Nav Background" }
      ],
      "default": "transparent_nav"
    },
...

```

## How we've modified Bootstrap

### Removed components

The following Bootstrap 4 components have been omitted from this project either because we don't need them or we already have an existing component in place.

- Dropdowns
- Input groups
- Nav
- Navbar
- Breadcrumb
- Pagination
- Badge
- Jumbotron
- Progress
- Media
- List Group
- Toasts
- Tooltip
- Popover
- Carousel
- Spinners
- Print

### Modifications

The following changes have been made to the original Bootstrap 4 files. The majority of them are additions as opposed to removals or modifications in order to keep the core functionality consistent with the bootstrap documentation.

- Add type mixins - typography variables have been broken down to each type style (h1, h2, ..p1, p2, ...)
- Remove `$gray` color map and all associated functions.
- Add gray scale colors to the map `$colors` map
- Helper classes file - `core/helpers.scss`
- Add `visually-hidden` and `visually-shown` mixins to `mixins/_visibility.scss`
- Add `core/layout.scss`
- Add component variables to control styling of components _outside_ of core
- Add all transition variables
- Add `mixins/_stretch`
- Add `mixins/_aspect-ratio`
- Add gray + black text utility colors to `utilities/_text.scss`
- Add letter spacing to `utilities/_text.scss`
- Add text transform none to `utilities/_text.scss`
- Add background black to `utilities/_background.scss`
- Add `xxl` breakpoint
- Add extra helper functions to `core/functions.scss`
- Add `$largest-container-width` to variables
- Turn off `$enable-validation-icons`
- Add `.card-header__title` and `.card-header__title-icon` to card styles.
- Add `.card-header__title-icon-trigger`
- Drop `.modal-dialog-centered` class and apply those styles directly to the base modal so modals are vertically ceneterd by default
- Add separate color map for buttons to avoid generating a bunch of extra button styles when using `$theme-colors`
- Add `breakpoint-infix-rear` breakpoint mixin to make generating BEM style classses easier
- Add `$form-check-vertical-spacing` to control spacing between `.form-check` elements
- Add `$custom-control-vertical-spacing` to control spacing between `.custom-control` elements
