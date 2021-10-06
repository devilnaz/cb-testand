'use strict';

const { useState, useRef } = React;

function Spoiler(){
    const [ showed, setShowed ] = useState(false);
    const spoilerEl = useRef(null);

    const show = (e) => {
        spoilerEl.current.classList.toggle("spoiler-block--showed");
        setShowed(!showed);
    }

    return (
        <div>
			<div className="spoiler__title">
                <span onClick={show}><i className={ showed ? "far fa-arrow-alt-circle-up" : "far fa-arrow-alt-circle-down" }></i>Очистка БД на тестовых стендах</span>
            </div>
			<div ref={spoilerEl} className="spoiler-block">В папке <b><i>temp</i></b> лежит архив с демо-базой, поэтому очищаем БД путём отката до демо-базы через <span className="route">Настройки -> Бэкап -> Восстановление из бэкапа (внутренний архив) -> Демонстрационная база</span> </div>
		</div>
    )
}

ReactDOM.render(<Spoiler />, document.querySelector('#spoiler'));