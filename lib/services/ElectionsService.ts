/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateElectionRequest } from '../models/CreateElectionRequest';
import type { ElectionDTO } from '../models/ElectionDTO';
import type { HealthCheckDTO } from '../models/HealthCheckDTO';
import type { ResultatsElectionDTO } from '../models/ResultatsElectionDTO';
import type { UpdateElectionRequest } from '../models/UpdateElectionRequest';
import type { VoteElectionDTO } from '../models/VoteElectionDTO';
import type { VoterElectionRequest } from '../models/VoterElectionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ElectionsService {
    /**
     * Détails d'une élection
     * Obtenir les détails d'une élection spécifique
     * @param electionId
     * @returns ElectionDTO OK
     * @throws ApiError
     */
    public static obtenirElection(
        electionId: string,
    ): CancelablePromise<ElectionDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/elections/{electionId}',
            path: {
                'electionId': electionId,
            },
        });
    }
    /**
     * Modifier une élection
     * Modifier une élection existante (accès administrateur uniquement)
     * @param authorization
     * @param electionId
     * @param requestBody
     * @returns ElectionDTO OK
     * @throws ApiError
     */
    public static modifierElection(
        authorization: string,
        electionId: string,
        requestBody: UpdateElectionRequest,
    ): CancelablePromise<ElectionDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/elections/{electionId}',
            path: {
                'electionId': electionId,
            },
            headers: {
                'Authorization': authorization,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Supprimer une élection
     * Supprimer une élection (accès administrateur uniquement)
     * @param authorization
     * @param electionId
     * @returns any OK
     * @throws ApiError
     */
    public static supprimerElection(
        authorization: string,
        electionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/elections/{electionId}',
            path: {
                'electionId': electionId,
            },
            headers: {
                'Authorization': authorization,
            },
        });
    }
    /**
     * Lister toutes les élections
     * Obtenir la liste de toutes les élections
     * @returns ElectionDTO OK
     * @throws ApiError
     */
    public static listerToutesElections(): CancelablePromise<Array<ElectionDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/elections',
        });
    }
    /**
     * Créer une élection
     * Créer une nouvelle élection (accès administrateur uniquement)
     * @param authorization
     * @param requestBody
     * @returns ElectionDTO OK
     * @throws ApiError
     */
    public static creerElection(
        authorization: string,
        requestBody: CreateElectionRequest,
    ): CancelablePromise<ElectionDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/elections',
            headers: {
                'Authorization': authorization,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Voter pour une élection
     * Enregistrer un vote pour une élection
     * @param authorization
     * @param electionId
     * @param requestBody
     * @returns VoteElectionDTO OK
     * @throws ApiError
     */
    public static voterPourElection(
        authorization: string,
        electionId: string,
        requestBody: VoterElectionRequest,
    ): CancelablePromise<VoteElectionDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/elections/{electionId}/voter',
            path: {
                'electionId': electionId,
            },
            headers: {
                'Authorization': authorization,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Résultats d'une élection
     * Obtenir les résultats d'une élection
     * @param electionId
     * @returns ResultatsElectionDTO OK
     * @throws ApiError
     */
    public static obtenirResultatsElection(
        electionId: string,
    ): CancelablePromise<ResultatsElectionDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/elections/{electionId}/resultats',
            path: {
                'electionId': electionId,
            },
        });
    }
    /**
     * Mes élections
     * Lister les élections créées par l'administrateur connecté
     * @param authorization
     * @returns ElectionDTO OK
     * @throws ApiError
     */
    public static listerMesElections(
        authorization: string,
    ): CancelablePromise<Array<ElectionDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/elections/mes-elections',
            headers: {
                'Authorization': authorization,
            },
        });
    }
    /**
     * Health check
     * Vérifier la santé du service élections
     * @returns HealthCheckDTO OK
     * @throws ApiError
     */
    public static healthCheck3(): CancelablePromise<HealthCheckDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/elections/health',
        });
    }
    /**
     * Élections disponibles
     * Lister les élections disponibles pour l'électeur connecté
     * @param authorization
     * @returns ElectionDTO OK
     * @throws ApiError
     */
    public static listerElectionsDisponibles(
        authorization: string,
    ): CancelablePromise<Array<ElectionDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/elections/disponibles',
            headers: {
                'Authorization': authorization,
            },
        });
    }
}
