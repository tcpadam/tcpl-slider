//  load a slider via ajax

//  change slide by either going previous or next

//  check which slide we're on, is it first, last or inbetween

//  go to a specific slide using the optional paging

(function ($, undefined) {

    'use strict';

    if ($) {

        $.fn.tcplSlider = function (options) {

            var defaults = $.extend({
                ajaxUrl: undefined,
                ajaxData: undefined,

                startSlide: 0,

                $slides: $('.carousel__slide'),

                $prevBtn: $('.carousel__prev'),
                $nextBtn: $('.carousel__next'),

                prevBtnTxt: '<',
                nextBtnTxt: '>',

                onLoad: function () { }
            }, options),

            slideWidth = defaults.$slides.width(),

            currentSlide = defaults.startSlide,
            totalSlides = defaults.$slides.length,

            init = function () {
                //  give buttons text
                defaults.$prevBtn.text(defaults.prevBtnTxt);
                defaults.$nextBtn.text(defaults.nextBtnTxt);

                //  get total width of slider based on slider width x number of slides
                $('.carousel__slides').width(slideWidth * totalSlides);

                //  inline set slide width
                defaults.$slides.width(slideWidth);

                //  hide prev button if current slide is the first
                checkBtnState();
            },

            checkBtnState = function () {
                //  check whether the current slide is at start or end
                var hidePrev = (currentSlide === defaults.startSlide) ? true : false,
                    hideNext = (currentSlide === (totalSlides - 1)) ? true : false;

                if (hidePrev) {
                    defaults.$prevBtn.hide();
                } else {
                    defaults.$prevBtn.show();
                }

                if (hideNext && !(defaults.ajaxUrl && defaults.ajaxData)) {
                    defaults.$nextBtn.hide();
                } else {
                    defaults.$nextBtn.show();
                }
            },

            loadSlide = function (callback) {
                var $lastSlide = defaults.$slides.last();

                $.ajax({
                    url: defaults.ajaxUrl,
                    data: defaults.ajaxData,

                    success: function (data) {
                        $('.carousel__slides').append(data);
                        var blah = 1;
                    }
                });

                //$lastSlide.append(html);

                if (typeof callback === 'function') {

                    return callback();

                }

            },

            prevSlide = function () {
                if (!checkBtnState()) {

                    $(defaults.$slides[0]).css({
                        transform: 'translateX(' + slideWidth * (currentSlide - 1) + ')',
                        marginLeft: slideWidth * (currentSlide - 1)
                    });

                    currentSlide--;

                }

                checkBtnState();
            },

            nextSlide = function () {
                if (!checkBtnState()) {

                    if ((currentSlide === totalSlides - 1) && (defaults.ajaxUrl && defaults.ajaxData)) {
                        loadSlide();

                        totalSlides++;
                    }

                    $(defaults.$slides[0]).css({
                        transform: 'translateX(' + slideWidth * (currentSlide - 1) + ')',
                        marginLeft: -slideWidth * (currentSlide + 1)
                    });

                    currentSlide++;

                }

                checkBtnState();
            };

            defaults.$prevBtn.on('click', prevSlide);
            defaults.$nextBtn.on('click', nextSlide);

            return this.each(function () {
                init();

                return this;
            });

        };

    }

}(jQuery));