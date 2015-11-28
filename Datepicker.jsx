class Datepicker extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    var format = 'n/j/Y';
    if (this.props.timepicker)
      format = format + ' H:i';
    $(React.findDOMNode(this)).datetimepicker({
      lang: 'en',
      changeYear: true,
      yearStart: (new Date()).getFullYear() - parseInt(this.props.yearStart),
      yearEnd: (new Date()).getFullYear() + parseInt(this.props.yearEnd),
      minDate: this.props.minDate ? parseInt(this.props.minDate) : false,
      maxDate: this.props.maxDate ? parseInt(this.props.maxDate) : false,
      format: format,
      timepicker: this.props.timepicker || false,
      onSelectDate: (time, input) => this.props.onDateChange(React.findDOMNode(this.refs[this.props.refName]).value, this.props.refName),
      onSelectTime: (time, input) => this.props.onDateChange(React.findDOMNode(this.refs[this.props.refName]).value, this.props.refName)
    });
  }
  render(){
    return(
      <input
        type='text'
        placeholder='mm/dd/yyyy'
        className="form-control"
        defaultValue={this.props.defaultValue}
        ref={this.props.refName}
        disabled={this.props.isValid || false}
        name={this.props.name}
        readOnly='true'
        value={this.props.value || ''}></input>
    );
  }
}
