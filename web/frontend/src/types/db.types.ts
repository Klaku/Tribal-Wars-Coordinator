export type DatabaseTribe = {
    tribe_id: number,
    tribe_name: string,
    tribe_tag: string,
}

export type DatabasePlayer = {
    player_id: number,
    player_name: string,
    tribe_id: number | null
}

export type DatabaseVillage = {
    village_id: number,
    village_name: string,
    village_x: number,
    village_y: number,
    player_id: number | null,
    village_points: number
}

export type DatabaseUser = {
    user_id: string,
    user_name: string,
    user_email: string,
}

export type DatabaseAccountAssignment = {
    account_assignment_id: number,
    user_id: string,
    player_id: number
}

export type DatabaseRoleAssignment = {
    role_assignment_id: number,
    role_id: number,
    user_id: string
}

export type DatabaseOperation = {
    operation_id: number,
    operation_name: string,
    operation_created: number,
    operation_created_by: number,
}

export type DatabaseOperationTarget = {
    operation_target_id: number,
    village_id: number,
    operation_id: number
}

export type DatabaseOperationPrincipal = {
    operation_principal_id: number,
    operation_principal_source: number,
    operation_principal_type: number
    operation_id: number
}

export type DatabaseOperationCommand = {
    operation_command_id: number,
    operation_command_target: number,
    operation_command_source: number,
    operation_command_type: number,
    operation_command_result: number,
    operation_command_timestamp: number,
    operation_id: number
}