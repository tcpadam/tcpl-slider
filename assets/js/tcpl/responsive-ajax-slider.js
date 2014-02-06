//  load a slider via ajax

//  change slide by either going previous or next

//  check which slide we're on, is it first, last or inbetween

//  go to a specific slide using the optional paging

(function ($, undefined) {

    'use strict';

    if ($) {

        $.fn.tcplSlider = function (options) {

            var defaults = $.extend({
                hasPaging: false,

                ajaxUrl: undefined,
                ajaxData: undefined,

                startSlide: 0,
                maxSlides:  5,

                $slider:  $('.carousel__slides'),
                $slides:  $('.carousel__slide'),
                $prevBtn: $('.carousel__prev'),
                $nextBtn: $('.carousel__next'),

                $pager: $('.carousel__paging'),
                page:   'carousel__page',

                prevBtnTxt: '<',
                nextBtnTxt: '>'
            }, options),

            i = 0,

            //  set the width of the slide, update on resize
            slideWidth = defaults.$slides.width(),

            //  current slide that is in view
            currentSlide = defaults.startSlide,

            //  total number of slides, update on new slide added
            totalSlides = defaults.$slides.length,

            init = function () {
                //  check whether to add paging
                if (defaults.hasPaging && defaults.maxSlides) {

                    for (i; i < totalSlides; i++) {

                        defaults.$pager.append($('<li />').attr({
                            'data-slide': i,
                            class:   defaults.page
                        }).text(i + 1));

                    }

                    i = 0;
                }

                //  give buttons text
                defaults.$prevBtn.text(defaults.prevBtnTxt);
                defaults.$nextBtn.text(defaults.nextBtnTxt);

                //  get total width of slider based on slider width x number of slides
                defaults.$slider.width(slideWidth * totalSlides);

                //  inline set slide width
                defaults.$slides.width(slideWidth);

                //  hide prev button if current slide is the first
                checkBtnState();
            },

            checkBtnState = function () {
                //  check whether the current slide is at start or end
                return {
                    isStart: (currentSlide === defaults.startSlide) ? true : false,
                    isEnd:   (currentSlide === (totalSlides - 1)) ? true : false
                };
            },

            getSlide = function (callback) {
                $.ajax({
                    url: defaults.ajaxUrl,
                    data: defaults.ajaxData,

                    success: function (data) {
                        defaults.$slider.append(data);

                        data.page++;
                    }
                });
            },

            //  refactor prev and next into one and allow moving by amounts
            moveSlide = function (moveBy) {
                //  value must exist
                if (moveBy) {
                    moveBy = moveBy * currentSlide;

                    defaults.$slides.first().css({
                        marginLeft: (moveBy) ? slideWidth * moveBy : slideWidth
                    });

                    //  increment

                } else {

                    throw new Error('moveToSlide was not given a moveBy param');

                }
            };

            // prevSlide = function () {
            //     if (!checkBtnState()) {

            //         $(defaults.$slides[0]).css({
            //             transform: 'translateX(' + slideWidth * (currentSlide - 1) + ')',
            //             marginLeft: slideWidth * (currentSlide - 1)
            //         });

            //         currentSlide--;

            //     }

            //     checkBtnState();
            // },

            // nextSlide = function () {
            //     if (!checkBtnState() && currentSlide < defaults.maxSlides) {

            //         if ((currentSlide === totalSlides - 1) && (defaults.ajaxUrl && defaults.ajaxData)) {
            //             getSlide();

            //             totalSlides++;
            //         }

            //         $(defaults.$slides[0]).css({
            //             transform: 'translateX(' + slideWidth * (currentSlide - 1) + ')',
            //             marginLeft: -slideWidth * (currentSlide + 1)
            //         });

            //         currentSlide++;

            //     }

            //     checkBtnState();
            // };

            //  event listeners
            defaults.$prevBtn.on('click', function () {
                moveSlide(1);
            });

            defaults.$nextBtn.on('click', function () {
                moveSlide(-1)
            });

            //  run on each instance of tcplSlider()
            return this.each(function () {
                //  init slider
                init();

                //  used for chaining
                return this;
            });

        };

    }

}(jQuery));