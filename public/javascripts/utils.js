var Ajax = {
	GET: function (url, callback) {
		var req = new XMLHttpRequest();
		
		req.open('GET', url, true);
		req.onreadystatechange = function (aEvt) {
			if (req.readyState == 4) {
				if(req.status == 200)
					callback(req.responseText);
				else
					console.error('Ajax GET error.');
			}
		};
		
		req.send(null);
	}
}

var $ = function (selector, el) {
	if (!el) { el = document; }
	return el.querySelector(selector);
}

var $$ = function (selector, el) {
	if (!el) { el = document; }
	return el.querySelectorAll(selector);
}

String.prototype.startsWith = function (str) {
	return (this.match("^" + str) == str);
}

var parse_hostname = function (hostname) {
	var parts = hostname.split(":");
	if (/[a-zA-Z]/.test(hostname)) {
		return {host: parts[0].split('.')[0], port: parts[1]};
	} else {
		return {host: parts[0], port: parts[1]};
	}
}

var format_timestamp = function (timems) {
    var date_obj = new Date(timems);

    return date_obj.getHours() + ":" + date_obj.getMinutes() + ":" + date_obj.getSeconds() + "." + date_obj.getMilliseconds();
}

var format_hostname = function (hostname) {
    if (/[a-zA-Z]/.test(hostname)) {
        var parts = hostname.split(":");
        return parts[0].split('.')[0] + ":" + parts[1];
    } else {
        return hostname;
    }
}

var format_size = function (size) {
    if (size < 1024 * 2) {
        return size + "B";
    } else if (size < 1024 * 1024 * 2) {
        return (size / 1024).toFixed(2) + "KB";
    } else {
        return (size / 1024 / 1024).toFixed(2) + "MB";
    }
}