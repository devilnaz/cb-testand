'use strict';
class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            items: [],
            isLoad: false
        }
    }

    componentDidMount = async () => {
        let response = await fetch('./api/getStandsInfo.php');
        let rows = await response.json();
        let items = [];
        for(const [i, row] of rows.entries()){
            if(row.branch.length !== 0){
                row.id = i;
                items.push(row);
            }
        }
        this.setState({ 
            items: items,
            isLoad: true 
        });
        document.querySelector('#spoiler').style.display =  'block';
    }

    render(){
        if (this.state.isLoad){
            return (
                <div className="main_container">
                    <TestStandList items={this.state.items} />
                </div>
            );
        }
        return (
            <div className="main_container">
                <div className="status">Загрузка...</div>
            </div>
        );
    }
}

class TestStandList extends React.Component {
    render() {
        return (
            <div className="test_stand_list">
                <div className="title_list">
                    <div className="stand-name">Наименование</div>
                    <div className="stand-master">Master</div>
                    <div className="stand-branch">Ветка</div>
                    <div className="stand-controls"></div>
                </div>
                {
                    this.props.items.map(item => {
                        return (<TestStandItem key={item.id} item={item} />)
                    })
                }
            </div>
        );
    }
}

class TestStandItem extends React.Component {
    constructor(props){
        super(props);
        this.onChangeStateBranch = this.onChangeStateBranch.bind(this);
        this.onHandleKeyDown = this.onHandleKeyDown.bind(this);
        this.onChangeBranch = this.onChangeBranch.bind(this);
        this.onBackToMaster = this.onBackToMaster.bind(this);
        this.onBranchPull = this.onBranchPull.bind(this);
        this.loading = this.loading.bind(this);
        this.getBranchesDataList = this.getBranchesDataList.bind(this);
        this.state = {
            id: this.props.item.id,
            name: this.props.item.name,
            master: this.props.item.master,
            branch: this.props.item.branch,
            route: this.props.item.route,
            isChange: false,
            loading: false,
            inputIsSelect: true,
            available_branches: []
        }
        this.inputRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.isChange && this.state.inputIsSelect){
            this.inputRef.current.select();
        }
    }

    componentDidMount = async () => {
        this.getBranchesDataList();
    }

    onChangeStateBranch(e){
        this.setState({ branch: e.target.value, inputIsSelect: false  });
    }

    onHandleKeyDown = async (e) => {
        if (e.key === 'Enter') {
          this.onChangeBranch();
        }
        else if( e.key === 'Escape'){
            let data = new FormData();
            data.append("route", this.state.route);
            let response = await fetch('./api/getStandGitBranch.php', {
                method: "POST",
                body: data
            });
            let result = await response.json();
            this.setState({ 
                isChange: false, 
                branch: result.branch, 
                inputIsSelect: true 
            });
        }
    }

    onChangeBranch = async () => {
        this.setState({ loading: true });
        if(this.state.isChange){
            let data = new FormData();
            data.append("branch", this.state.branch);
            data.append("route", this.state.route);
            data.append("clear", 0);
            let response = await fetch('./api/changeBranch.php', {
                method: "POST",
                body: data
            });
            let result = await response.json();
            if(result.ok){
                this.setState({
                    branch: result.branch_name,
                    isChange: false,
                    loading: false,
                    inputIsSelect: true
                });
            }
            else {
                console.log(result.log);
                alert(result.error);
                let data = new FormData();
                data.append("route", this.state.route);
                let response_branch = await fetch('./api/getStandGitBranch.php', {
                    method: "POST",
                    body: data
                });
                let result_branch = await response_branch.json();
                this.setState({ 
                    isChange: false,
                    loading: false,
                    inputIsSelect: true, 
                    branch: result_branch.branch 
                });
            }
        }
        else {
            this.setState({ 
                isChange: true,
                loading: false
            });
        }
    }

    onBackToMaster = async () => {
        this.setState({ loading: true });
        let data = new FormData();
        data.append("branch", this.state.branch);
        data.append("route", this.state.route);
        data.append("clear", 1);
        let response = await fetch('./api/changeBranch.php', {
            method: "POST",
            body: data
        });
        let result = await response.json();
        if(result.ok){
            this.setState({
                branch: result.branch_name,
                isChange: false,
                loading: false,
                inputIsSelect: true
            })
        }
        else {
            alert('Ошибка при очистке, обратитесь к администратору!');
            let data = new FormData();
            data.append("route", this.state.route);
            let response_branch = await fetch('./api/getStandGitBranch.php', {
                method: "POST",
                body: data
            });
            let result_branch = await response_branch.json();
            this.setState({ 
                loading: false, 
                branch: result_branch.branch,
                inputIsSelect: true,
            });
        }
    }

    onBranchPull = async () => {
        this.setState({ loading: true });
        let data = new FormData();
        data.append("route", this.state.route);
        let response = await fetch('./api/pullStandBranch.php', {
            method: "POST",
            body: data
        });
        let result = await response.json();
        if(!result.ok){
            alert('Ошибка при пуле изменений, обратитесь к администратору!');
        }
        this.setState({
            loading: false,
        });
    }

    loading(value){
        this.setState({
            loading: value
        });
    }

    getBranchesDataList = async () => {
        let data = new FormData();
        data.append("route", this.state.route);
        let response = await fetch('./api/getBranchesDataList.php', { 
            method: "POST",
            body: data
         });
        let result = await response.json();
        console.log(result.log);
        this.setState({
            available_branches: result.branches
        })
    }

    render() {
        return (
            <div className="stand" key={ this.props.route }>
                <div className="stand-name">
                    { this.state.name }
                </div>
                <div className="stand-master">
                    { this.state.master }
                </div>
                <div className="stand-branch">
                    { 
                        this.state.isChange
                            ? (
                                <div>
                                    <input 
                                        type="text" 
                                        ref={ this.inputRef } 
                                        value={ this.state.branch } 
                                        placeholder="Ветка" 
                                        onKeyDown={this.onHandleKeyDown} 
                                        onChange={this.onChangeStateBranch.bind(this)} 
                                        list={'stand_'+this.state.name}
                                    />
                                    <datalist id={'stand_'+this.state.name}>
                                        {this.state.available_branches.map((item, key) => (<option key={key} value={item} />))}
                                    </datalist>
                                </div>
                                
                            )
                            : (<a href={ this.state.route } target="_blank">{ this.state.branch }</a>)
                    } 
                    { this.state.loading ? (<div className="preloader-container"><img src="./images/load.gif" /></div>) : "" }
                </div>
                <div className="stand-controls">
                    <button 
                        title={ this.state.isChange ? "Разместить ветку" :  "Изменить ветку"}
                        onClick={ this.onChangeBranch.bind() }
                        className={ this.state.isChange ? "btn-green" : "" }
                        disabled={ this.state.branch != this.state.master && !this.state.isChange }
                    >   
                       <i className={ this.state.isChange ? "fas fa-arrow-right" : "fas fa-code-branch" }></i>
                    </button>
                    <button 
                        title="Очистить (до master)"
                        onClick={ this.onBackToMaster.bind() }
                        disabled={ this.state.branch == this.state.master }
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <button 
                        title="Обновить (Pull)"
                        onClick={ this.onBranchPull.bind() }
                    >
                        <i className="fas fa-sync-alt"></i>
                    </button>
                    <DropDownButton 
                        branch={this.state.branch}
                        route={this.state.route}
                        loading={this.loading}
                    />
                </div>
            </div>
        );
    }
}

class DropDownButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            branch: this.props.branch,
            route: this.props.route,
        }
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.showDropDown = this.showDropDown.bind(this);
        this.hardReset = this.hardReset.bind(this);
        this.composerInstall = this.composerInstall.bind(this);
        this.composerUpdate = this.composerUpdate.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    showDropDown(){
        this.setState({'show': !this.state.show });
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            console.log(1);
            this.setState({show: false});
        }
    }

    hardReset = async () => {
        this.props.loading(true);
        let data = new FormData();
        data.append("route", this.state.route);
        let response = await fetch('./api/hardReset.php', {
            method: "POST",
            body: data
        });
        let result = await response.json();
        console.log(result.log);
        if(!result.ok){
            alert('Возникла непредвиденная ошибка, обратитесь к администратору!');
        }
        this.props.loading(false);
    }

    composerUpdate = async () => {
        this.props.loading(true);
        let data = new FormData();
        data.append("route", this.state.route);
        let response = await fetch('./api/composerUpdate.php', {
            method: "POST",
            body: data
        });
        let result = await response.json();
        console.log(result.log);
        if(!result.ok){
            alert('Возникла непредвиденная ошибка, обратитесь к администратору!');
        }
        this.props.loading(false);
    }

    composerInstall = async () => {
        this.props.loading(true);
        let data = new FormData();
        data.append("route", this.state.route);
        let response = await fetch('./api/composerInstall.php', {
            method: "POST",
            body: data
        });
        let result = await response.json();
        console.log(result.log);
        if(!result.ok){
            alert('Возникла непредвиденная ошибка, обратитесь к администратору!');
        }
        this.props.loading(false);
    }

    render() {
        return (
            <div ref={this.wrapperRef} className="dropdown__container">
                <button
                    onClick={this.showDropDown}
                ><i className="fas fa-ellipsis-v"></i></button>
                <ul 
                    style={{
                        display: (this.state.show ? 'block' : 'none'), 
                    }}
                >
                    <li onClick={this.hardReset}>Сброс</li>
                    <li onClick={this.composerUpdate}>Composer update</li>
                    <li onClick={this.composerInstall}>Composer install</li>
                </ul>
            </div>
        );
    }
}

ReactDOM.render(<Home />, document.querySelector('#root'));