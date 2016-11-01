import React from 'react';
import ReactDOM from 'react-dom';
import Animate from 'rc-animate';
import classNames from 'classnames';
import omit from 'omit.js';
import Icon from '../icon';
import warning from '../_util/warning';
import splitObject from '../_util/splitObject';

export interface TagProps {
  type?: 'default' | 'simple';
  checkable?: boolean;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked?: boolean) => void;
  /** 标签是否可以关闭 */
  closable?: boolean;
  /** 关闭时的回调 */
  onClose?: Function;
  /** 动画关闭后的回调 */
  afterClose?: Function;
  style?: React.CSSProperties;
}

export default class Tag extends React.Component<TagProps, any> {
  static defaultProps = {
    prefixCls: 'ant-tag',
    type: 'default',
  };

  constructor(props: TagProps) {
    super(props);
    warning(!('color' in props), '`Tag[color]` is deprecated, please override color by CSS instead.');

    this.state = {
      checked: props.checked !== undefined ? props.checked : props.defaultChecked,
      closing: false,
      closed: false,
    };
  }

  componentWillReceiveProps(nextProps: TagProps) {
    if (nextProps.checked !== undefined) {
      this.setState({ checked: nextProps.checked });
    }
  }

  toggleChecked = () => {
    const checked = !this.state.checked;
    if (this.props.checked === undefined) {
      this.setState({ checked });
    }

    const { onChange } = this.props;
    if (onChange) {
      onChange(checked);
    }
  }

  close = (e) => {
    const onClose = this.props.onClose;
    if (onClose) {
      onClose(e);
    }
    if (e.defaultPrevented) {
      return;
    }
    const dom = ReactDOM.findDOMNode(this) as HTMLElement;
    dom.style.width = `${dom.getBoundingClientRect().width}px`;
    // It's Magic Code, don't know why
    dom.style.width = `${dom.getBoundingClientRect().width}px`;
    this.setState({
      closing: true,
    });
  }

  animationEnd = (_, existed) => {
    if (!existed && !this.state.closed) {
      this.setState({
        closed: true,
        closing: false,
      });

      const afterClose = this.props.afterClose;
      if (afterClose) {
        afterClose();
      }
    }
  }

  render() {
    const [{
      prefixCls, type, checkable, closable, color, className, children,
    }, otherProps] = splitObject(
      this.props,
      ['prefixCls', 'type', 'checkable', 'closable', 'color', 'className', 'children']
    );
    const closeIcon = closable ? <Icon type="cross" onClick={this.close} /> : '';
    const classString = classNames({
      [prefixCls]: true,
      [`${prefixCls}-${type}`]: true,
      [`${prefixCls}-checkable`]: checkable,
      [`${prefixCls}-checkable-checked`]: this.state.checked,
      [`${prefixCls}-${color}`]: !!color,
      [`${prefixCls}-has-color`]: !!color,
      [`${prefixCls}-close`]: this.state.closing,
      [className]: !!className,
    });
    // fix https://fb.me/react-unknown-prop
    const divProps = omit(otherProps, [
      'onClose',
      'afterClose',
    ]);
    return (
      <Animate component=""
        showProp="data-show"
        transitionName={`${prefixCls}-zoom`}
        transitionAppear
        onEnd={this.animationEnd}
        >
        {this.state.closed ? null : (
          <div
            data-show={!this.state.closing}
            {...divProps}
            className={classString}
            style={{ backgroundColor: /blue|red|green|yellow/.test(color) ? null : color }}
            onClick={this.toggleChecked}
          >
            <span className={`${prefixCls}-text`}>{children}</span>
            {closeIcon}
          </div>
        ) }
      </Animate>
    );
  }
}
