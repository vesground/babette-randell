import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Bar = styled.div`
  height: 100%;
  width: ${(props) => props.progress}%;
  transition: width 0.4s;
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: ${(props) => props.theme.colors.brand};
  border-radius: inherit;
  text-align: right;
`;

export default function ProgressBar({className, progress}) {
  return (
    <div className={className}>
      <Bar progress={progress} />
    </div>
  );
}

ProgressBar.propTypes = {
  className: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
};

ProgressBar = styled(ProgressBar)`
  height: 6px;
  width: 460px;
  max-width: 100%;
  background: ${(props) => props.theme.colors.grayBackdrop};
  border-radius: 3px;
  margin: 0 auto 2rem;
`;
