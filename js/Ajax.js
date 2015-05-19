/*!
 * 
 * Ajax-Module - Medieninformatik 3
 *
 * Copyright(c) 2012 Bremen, Germany
 *
 * Author:
 *     Andre Koenig <akoenig@stud.hs-bremen.de>
 *
 * MIT Licensed
 * 
 * Modified 2013 - Medieninformatik 2
 * by Yvonne Zoellner (Update line 34)
 *
 */

"use strict";

var Ajax = (function () {

	return {
		getJSON : function (url, callback) {
			if (!url) {
				throw new Error('getJSON: Bitte eine URL angeben.');
			}

			if (!callback || typeof callback !== 'function') {
				throw new Error('getJSON: Bitte eine Callback-Funktion angeben.');
			}

			var request = new XMLHttpRequest();

			request.addEventListener("load", function (evt) {

                    var  data = JSON.parse(evt.target.responseText);
                    callback(data);


			});


            request.open('GET', url, false);
			request.send();
		}
	};

}());