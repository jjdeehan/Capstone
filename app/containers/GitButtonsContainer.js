import React from 'react';
import simpleGit from 'simple-git';
import chalk from 'chalk';
import {connect} from 'react-redux';
import { resetBranchQuery, closeGitMenu, toggleDisplayBranchList, successHandler, errorHandler, currentBranch, branchList, branchQuery, displayTrue, statusHandler, commitHandler} from '../actionCreators/GitButtonsActionCreators'
import GitButtonsComponent from '../components/GitButtonsComponent';


const mapStateToProps = (state) => {
	return {
		branchList: state.GitButtons.branchList,
		successData: state.GitButtons.successData,
		errorData: state.GitButtons.errorData,
		currentBranch: state.GitButtons.currentBranch,
		displayBranch: state.GitButtons.displayBranch,
		branchQuery: state.GitButtons.branchQuery,
		commitMessage: state.GitButtons.commitMessage,
		dir: state.fileSystem.dir,
		repo: state.repo.selectedRepo
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		displayBranches: () => dispatch(displayTrue()),
		toggleDisplayBranches: () => dispatch(toggleDisplayBranchList()),
		handleSuccess: (successMessage) => dispatch(successHandler(successMessage)),
		handleError: (errorMessage) => dispatch(errorHandler(errorMessage)),
		updateBranchList: (branchSummary) => dispatch(branchList(branchSummary)),
		handleBranchChangeQuery: (typedEvent) => dispatch(branchQuery(typedEvent.target.value)),
		handleStatus: (status) => dispatch(statusHandler(status)),
		handleCommitMessage: (typedEvent) => dispatch(commitHandler(typedEvent.target.value)),
		dispatchCloseGitMenu: () => dispatch(closeGitMenu(false)),
		dispatchResetBranchQuery: () => dispatch(resetBranchQuery())
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(GitButtonsComponent)