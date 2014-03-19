//22
document.addEventListener('DOMContentLoaded', function () {
    var addSong = document.querySelector('#addButton'),
        saveButton = document.querySelector('#saveButton'),
        ul = document.querySelector('#playlist'),
        songList = [],
        nextSongId = 0, del;


    addSong.addEventListener('click', function (item) {
        var song = document.querySelector('#songTextInput').value;
        var item = {text: song};
        item.id = nextSongId++;
        songList.push(item);
        renderItem(item);
        save();
    });


    ul.addEventListener('click', function (e) {
        if (e.target.nodeName === "LI") {
        e.target.setAttribute("contenteditable", "true");
        }
    });

    ul.addEventListener('mouseover', function (e) {
        // check event source
        if (e.target.nodeName !== "LI") {
            // don't create button in UL
            return;
        }
        // don't create button if already exists
        if (del != null)
        {
            return;
        }

        del = document.createElement('button');
        del.setAttribute("id", "kill");
        del.innerHTML = 'x';
        e.target.appendChild(del);

        del.addEventListener('click', function () {
            try {
                var parentBut = del.parentNode;
                console.log (songList[e.target.id]);
                songList.splice(e.target.id,1)
                del = null;
                parentBut.parentNode.removeChild(parentBut);
                save();
            }
            catch (e) {
            }
        });

    });

    ul.addEventListener('mouseout', function (e) {
        // don't remove button if mouse moved from LI->Button
        if (del !=null && e.relatedTarget != del) {
            del.parentNode.removeChild(del);
            del = null;
        }
    });


    var saveTime;
    ul.addEventListener('keyup', function (e) {
        songList[e.target.id].text = e.target.textContent;
        clearTimeout(saveTime);
        saveTime = setTimeout(save, 1000);
    });

    function save() {
        var request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:1337/');
        request.send(JSON.stringify(songList.map(function (item) {
            return {
                text: item.text,
                id: item.id
            };
        })));
    }

    load();

    function load() {
        var request = new XMLHttpRequest();
        request.addEventListener('load', function () {
            try {
                songList = JSON.parse(this.responseText);
                songList.forEach(renderItem);
                nextSongId = Math.max.apply(Math, songList.map(function (o) {
                    return o.id;
                })) + 1;
            } catch (e) {
            }
        });
        request.open('GET', 'http://localhost:1337/');
        request.send();

    }

    function renderItem(item) {
        var li = document.createElement("li");
        li.setAttribute("id", item.id);
        li.textContent = item.text;
        ul.appendChild(li);
    }
});
