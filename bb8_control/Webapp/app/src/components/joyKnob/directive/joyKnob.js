/**
 * @fileOverview
 *
 *  Copyright (c) 2003-2013 Wolters Kluwer Technology B.V. and/or its affiliates. All Rights Reserved.
 *
 *  This application source code (the "Software") is the confidential and proprietary information of
 *  Wolters Kluwer Technology BV and/or its affiliates.  The Software contains trade secret information,
 *  and you may not reverse-engineer, decompile, disclose, copy, modify, upload, download, transmit,
 *  republish, or otherwise misappropriate the Software without the express written approval of
 *  Wolters Kluwer Technology BV and/or its affiliates.  In addition, the Software is protected by U.S.
 *  and other applicable copyright laws.  The Software is provided solely for the purpose of technical
 *  analysis within the scope of a single project, subject to applicable license requirements set forth
 *  by Wolters Kluwer Technology BV and/or its affiliates.  All copies of this Software must be destroyed
 *  or otherwise removed from your system and any associated hardware when any applicable license terminates
 *  or expires.
 *
 * Created by Kornel_Martyin on 3/22/2016.
 */

bb8_control.directive("joyKnob", function () {
        return {
          restrict: 'A',
          templateUrl: 'src/components/joyKnob/templates/joyKnob.html',
          link: function (scope, element, attrs) {
            var knob = $($(element).find('.joyKnob'));
            var dragging = false;
            var elemOffset = {x:$(element).offset().left, y: $(element).offset().top};
            var body = $('body');
            var elemDimensions = {x: $(element).width(), y: $(element).height()};
            var radius = elemDimensions.x / 2;

            body.on('mousemove', handleMouseMove);
            body.on('mouseup', function () {
              dragging = false;
              if(attrs.elastic){
                centerKnob();
              }
            });

            knob.on('mousedown', function () {
              dragging = true;
            });

            centerKnob();

            function centerKnob(){
              knob.css({top: radius - Math.ceil(knob.width() / 2) + 'px'});
              knob.css({left: radius - Math.ceil(knob.width() / 2) + 'px'});
            }

            function handleMouseMove(event) {
              if (dragging) {
                var knobPosition = calculatePosition(event);

                knob.css({top: knobPosition.y  + 'px'});
                knob.css({left: knobPosition.x  + 'px'});
              }
            }

            function calculatePosition(mouseEvent) {
              var mousePos = {x: mouseEvent.clientX, y: mouseEvent.clientY};
              var center = {x: (elemDimensions.x / 2) + elemOffset.x, y: (elemDimensions.y / 2) + elemOffset.y};
              var distance = Math.sqrt(Math.pow(center.x - mousePos.x,2) + Math.pow(center.y - mousePos.y,2));

              var deltaY = mousePos.y - center.y;
              var deltaX = mousePos.x - center.x;

              var angle = Math.atan(deltaY / deltaX);

              if(deltaX < 0){
                angle = angle + Math.PI;
              }

              if(distance > radius){
                return {x: radius + (radius * Math.cos(angle)) - Math.ceil(knob.width() / 2), y: radius + (radius * Math.sin(angle)) - Math.ceil(knob.width() / 2)};
              } else {
                return {x: (mousePos.x - elemOffset.x - Math.ceil(knob.width() / 2)), y: (mousePos.y - elemOffset.y - Math.ceil(knob.height() / 2))}
              }
            }
          }
        }
    });