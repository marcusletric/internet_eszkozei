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

bb8_control
  .directive("colorPicker", function ($window,$http) {
        return {
            restrict: 'A',
            templateUrl: 'src/components/colorPicker/templates/canvas.html',
            replace: true,
            link: function (scope,element) {
              var renderer = element;

              var ctx = renderer[0].getContext('2d');
              renderer[0].width = 500;
              renderer[0].height = 500;

              scope.renderDom = function(element){
                $http.get('css/app.css').then(function(response){
                  var domString = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
                    '<foreignObject width="100%" height="100%">' +
                    '<div xmlns="http://www.w3.org/1999/xhtml">' +
                    '<style>' +
                      response.data +
                       '[joy-knob] .joyKnobBoundary .joyKnob { display: none; }' +
                    '</style>' +
                    (new XMLSerializer).serializeToString(element).replace(/(\r\n|\n|\r|\t)/gm,"").replace(/(\r\n|\n|\r|\t)/gm,"") +
                    '</div>' +
                    '</foreignObject>' +
                    '</svg>';


                  var img = new Image();

                  img.crossOrigin = 'anonymous';
                  img.onload = function () {
                    ctx.drawImage(img, 0, 0);
                  };

                  img.src = 'data:image/svg+xml,' + domString;
                });
              };

              scope.getColorAt = function(x,y){
                var imgd = ctx.getImageData(x, y, 1, 1);
                return [imgd.data[0], imgd.data[1], imgd.data[2]];
              }
            }
        }
    });
