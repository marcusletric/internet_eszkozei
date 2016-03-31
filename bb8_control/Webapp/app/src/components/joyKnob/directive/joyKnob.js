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
            var elemDimensions = {x: $(element).width(), y: $(element).height()};
            scope.knob = $($(element).find('.joyKnob'));
            scope.radius = elemDimensions.x / 2;
            var knobRadius = Math.ceil(scope.knob.width() / 2);
            var dragging = false;
            var elemOffset = {x:$(element).offset().left, y: $(element).offset().top};
            var body = $('body');

            body.on('mousemove touchmove', handleMouseMove);
            body.on('mouseup touchend', function () {
              dragging = false;
              if(attrs.elastic){
                centerKnob();
              }
            });

            scope.knob.on('mousedown touchstart', function () {
              dragging = true;
            });

            scope.knob.css({top: scope.radius - knobRadius + 'px'});
            scope.knob.css({left: scope.radius - knobRadius + 'px'});

            function centerKnob(){
              scope.knob.css({top: scope.radius - knobRadius + 'px'});
              scope.knob.css({left: scope.radius - knobRadius + 'px'});
              scope.knobMoved(scope.radius, scope.radius);
            }

            function handleMouseMove(event) {
              if (dragging) {
                var knobPosition = calculatePosition(event);

                scope.knob.css({top: knobPosition.y  + 'px'});
                scope.knob.css({left: knobPosition.x  + 'px'});
                scope.knobMoved(knobPosition.x + knobRadius, knobPosition.y + knobRadius);
              }
            }

            function calculatePosition(mouseEvent) {
              var mousePos = {x: mouseEvent.clientX || mouseEvent.originalEvent.touches[0].clientX, y: mouseEvent.clientY || mouseEvent.originalEvent.touches[0].clientY};
              var center = {x: scope.radius + elemOffset.x, y: scope.radius + elemOffset.y};
              var distance = Math.sqrt(Math.pow(center.x - mousePos.x,2) + Math.pow(center.y - mousePos.y,2));

              var deltaY = mousePos.y - center.y;
              var deltaX = mousePos.x - center.x;

              var angle = Math.atan(deltaY / deltaX);

              if(deltaX < 0){
                angle = angle + Math.PI;
              }

              if(distance > scope.radius-2){
                return {x: scope.radius + (scope.radius * Math.cos(angle)*.9) -knobRadius, y: scope.radius-1 + (scope.radius * Math.sin(angle)*.9) - knobRadius};
              } else {
                return {x: (mousePos.x - elemOffset.x - knobRadius), y: (mousePos.y - elemOffset.y - knobRadius)}
              }
            }
          }
        }
    });
